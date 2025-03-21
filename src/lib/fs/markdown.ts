import {
  BaseDirectory,
  exists,
  mkdir,
  readDir,
  readTextFile,
} from '@tauri-apps/plugin-fs';

type ReadMarkdownFilesReturn =
  | {
      files: {
        name: string;
        content: string;
      }[];
    }
  | {
      error: string;
    };

const KANBAN_DIR = 'kanban';
const BASE = BaseDirectory.AppLocalData;

async function createDirIfNotExists() {
  const doesExist = await exists(KANBAN_DIR, {
    baseDir: BASE,
  });
  if (!doesExist) {
    console.log('Kanban directory does not exist, creating it...');
    return mkdir(KANBAN_DIR, { baseDir: BASE });
  }
}
/**
 * Reads all the markdown files in the /kanban directory
 */
export async function readMarkdownFiles(): Promise<ReadMarkdownFilesReturn> {
  try {
    console.log('attempting to create dir');

    await createDirIfNotExists();

    console.log('attempting to read dir');
    const entries = await readDir(KANBAN_DIR, {
      baseDir: BASE,
    });

    console.log('entries', entries);

    const results = await Promise.all(
      entries.map(async (entry) => {
        if (!entry.isFile) {
          return null;
        }

        const content = await readTextFile(`${KANBAN_DIR}/${entry.name}`, {
          baseDir: BASE,
        });

        return {
          name: entry.name,
          content: content,
        };
      })
    );

    const files = results.filter((result) => result !== null);
    return {
      files: files.map((file) => ({
        name: file.name,
        content: file.content,
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
