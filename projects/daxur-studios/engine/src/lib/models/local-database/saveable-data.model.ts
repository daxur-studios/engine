/** Data that can be saved to IndexedDB
 *
 * IndexedDB is a low-level API for client-side storage of structured data, including files/blobs.
 * You can save all kinds of data with IndexedDB such as
 * `arrays`, `booleans`, `dates`, `numbers`, `objects`, `strings`, `null`, `undefined`, `blobs`, `files`, `file lists`, `array buffers`, `array buffer views`, and `image data`.
 *
 * Note: Some types of data, such as Error objects, functions, and DOM nodes, can't be stored in IndexedDB.
 */
export type SaveableData =
  | null
  | boolean
  | number
  | string
  | ArrayBuffer
  | Blob
  | Date
  | SaveableData[]
  | { [key: string]: SaveableData };
