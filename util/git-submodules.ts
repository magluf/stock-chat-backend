import { promisify } from 'util';
import { exec } from 'child_process';
import * as readline from 'readline';

import colors from 'colors';
const execute = promisify(exec);

// const tempDir = process.argv[2] || '~/'; // TODO: Find out if this is safe!
const tempDir = '~/';

const parentDir = __dirname.split('util')[0];
// TODO: Only needed if it's safe to pass tempDir on script call.
// if (tempDir === parentDir) {
//   console.log(`Cannot use root project folder as the tempDir.`);
//   throw 'error';
// }

const checkForUncommitedChanges = async () => {
  console.log(
    colors.bold(
      '▶️▶️ Checking if there are uncommited changes in current working tree...',
    ),
  );
  await execute('git status --porcelain')
    .then((res) => {
      if (res.stdout !== '') {
        console.log(
          `❗️ There are uncommited changes:\n\n${colors.bold(res.stdout)}`.red,
        );
        console.log(
          `❗️ Commit the changes before attempting to create submodules.`.red,
        );
        throw 'Working tree not clean';
      }
      console.log('✔ No uncommited changes.\n'.green);
    })
    .catch((err) => {
      console.log('checkForUncommitedChanges -> err', err);
      console.log(
        `❗️ Error checking for uncommited changes: ${colors.bold(
          err.stderr ? err.stderr : err,
        )}`.red,
      );
      throw err;
    });
};

const generateProductionFiles = async () => {
  console.log(colors.bold('▶️▶️ Generating production files...'));
  await execute('npm run build:prod')
    .then(() =>
      console.log('✔ Production files generated successfully.\n'.green),
    )
    .catch((err) => {
      console.log('❗️ Error generating production files.\n'.red);
      throw err;
    });
};

const moveFiles = async (from: string, to: string) => {
  return await execute(`mv ${from} ${to}`);
};

const waitForInput = (query: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
};

const deleteTempDirContens = async (folder: string) => {
  // TODO: Only needed if it's safe to pass tempDir on script call.
  // if (tempDir.endsWith('/')) {
  //   return await execute(`rm -rfv ${tempDir}${folder}`);
  // } else {
  //   return await execute(`rm -rfv ${tempDir}/${folder}`);
  // }
  await execute(`rm -rfv ${tempDir}${folder}`)
    .then((res) => {
      console.log(res.stdout.yellow.bold);
    })
    .catch((e) => {
      throw e;
    });
};

const handleTempDirNotEmpty = async (dirName: string, error: any) => {
  let ans = await waitForInput(
    colors.bold(
      `▶️▶️ Directory not empty. Do you wish to delete the contents of the directory at ${tempDir}${dirName}? [Y/n]: `,
    ),
  );
  if (ans === '' || ans === 'yes' || ans === 'y' || ans === 'Y') {
    console.log(
      colors.bold(`▶️▶️ Deleting ${tempDir}${dirName} contents...\n`),
    );
    await deleteTempDirContens(dirName);

    await moveFiles(`${parentDir}${dirName}`, tempDir)
      .then(() =>
        console.log(
          `✔ Temporary dir for ${dirName} files at: ${colors.bold(
            `${tempDir}${dirName}\n`,
          )}`.green,
        ),
      )
      .catch((e) => {
        throw e;
      });
  } else {
    throw error;
  }
};

const createGitSymbolicRef = async (name: string) => {
  console.log(
    colors.bold(`▶️▶️ Creating git symbolic ref for ${colors.bold(name)}...`),
  );
  return await execute(`git symbolic-ref HEAD refs/heads/${name}`);
};

const deleteGitIndex = async () => {
  console.log(colors.bold(`▶️▶️ Deleting ${colors.bold(`.git/index`)}...`));
  return await execute(`rm ${parentDir}.git/index`);
};

const cleanGitWorkingTree = async () => {
  console.log(colors.bold(`▶️▶️ Cleaning git working tree...`));
  return await execute(`git clean -fdx`);
};

const gitAddAll = async () => {
  return await execute('git add .');
};

const gitCommit = async (message: string) => {
  return await execute(`git commit -m "${message}"`);
};

const gitPushOrphanBranch = async (name: string) => {
  return await execute(`git push origin ${name}`);
};

const addProductionFilesToOrphanBranch = async (name: string) => {
  console.log(colors.bold(`▶️▶️ Creating orphan branch for ${name}...`));
  await gitAddAll()
    .then(
      async () =>
        await gitCommit(
          `Adding ${name} content to the orphan branch '${name}'`,
        ),
    )
    .then(async () => await gitPushOrphanBranch(name))
    .then(() => {
      console.log(`✔ New orphan branch pushed to origin remote.\n`.green);
    })
    .catch((err) => {
      console.log(
        `❗️ Error creating orphan branch: ${colors.bold(err.stderr)}`.red,
      );
      throw err;
    });
};

const createCleanOrphanBranch = async () => {
  await checkForUncommitedChanges();
  await generateProductionFiles();

  await createGitSymbolicRef('production')
    .then(() =>
      console.log(
        `✔ Symbolic ref for production created successfully.\n`.green,
      ),
    )
    .catch((err) => {
      console.log(
        `❗️ Error creating symbolic ref: ${colors.bold(err.stderr)}`.red,
      );
      throw err;
    });

  await deleteGitIndex()
    .then(() => console.log(`✔ .git/index removed.\n`.green))
    .catch((err) => {
      console.log(
        `❗️ Error deleting .git/index: ${colors.bold(err.stderr)}`.red,
      );
      throw err;
    });

  console.log(
    colors.bold(
      `▶️▶️ Moving production files to temporary dir at '${tempDir}' ...`,
    ),
  );
  await moveFiles(`${parentDir}production`, tempDir)
    .then(() =>
      console.log(
        colors.green(
          `✔ Temporary dir for production files at: ${colors.bold(
            `${tempDir}production\n`,
          )}`,
        ),
      ),
    )
    .catch(async (err) => {
      console.log(
        `❗️ Error setting up temporary production dir: ${colors.bold(
          err.stderr,
        )}`.red,
      );
      console.log(
        `❗️ Attempted to create dir at: ${colors.bold(
          `${tempDir}production\n`,
        )}`.red,
      );
      if (err.stderr.includes('Directory not empty')) {
        await handleTempDirNotEmpty('production', err);
      } else {
        throw err;
      }
    });

  await cleanGitWorkingTree()
    .then(() => console.log(`✔ Git working tree clean\n`.green))
    .catch((err) => {
      console.log(
        `❗️ Error cleaning git working tree: ${colors.bold(err.stderr)}`.red,
      );
      throw err;
    });

  console.log(
    colors.bold(
      `▶️▶️ Moving production files back to root folder at '${parentDir}' ...`,
    ),
  );
  await moveFiles(`${tempDir}production/*`, parentDir)
    .then(() =>
      console.log(
        colors.green(`✔ Production files added back to root folder.\n`),
      ),
    )
    .catch(async (err) => {
      console.log(
        `❗️ Error moving files back to root folder: ${colors.bold(err.stderr)}`
          .red,
      );
      throw err;
    });

  await addProductionFilesToOrphanBranch(`production`);
};

const gitCheckoutMaster = async () => {
  return await execute(`git checkout master`);
};

const getRemoteUrl = async () => {
  let url: string = '';
  await execute('git config --get remote.origin.url')
    .then((res) => {
      url = res.stdout;
    })
    .catch((err) => {
      throw err;
    });
  if (url !== '') {
    return url.trim();
  }
};

const gitAddSubmodule = async (name: string) => {
  return await execute(
    `git submodule add -b ${name} ${await getRemoteUrl()} ${name}`,
  );
};

const gitPush = async () => {
  return await execute(`git push`);
};

const createSubmodule = async (name: string) => {
  console.log(colors.bold(`▶️▶️ Creating submodule for ${name}...`));
  await gitCheckoutMaster()
    .then(async () => await gitAddSubmodule(name))
    .then(async () => await gitCommit(`Adding ${name} as a submodule.`))
    .then(async () => await gitPush())
    .then(() => {
      console.log(`✔ New ${name} submodule added to remote.\n`.green);
    })
    .catch((err) => {
      console.log(
        `❗️ Error creating submodule: ${colors.bold(err.stderr)}`.red,
      );
      throw err;
    });
};

createCleanOrphanBranch().then(async () => {
  await createSubmodule('production');
});
