export async function writeSnapshots(snapshots: Map<string, unknown>) {
  await Bun.write(
    process.env.SNAPSHOTS_FILE,
    JSON.stringify(Object.fromEntries(snapshots)),
  );
}
