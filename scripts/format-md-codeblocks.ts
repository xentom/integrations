const CODE_BLOCK_REGEX = /```(ts|typescript)\n([\s\S]*?)```/g

async function formatWithBiome(code: string): Promise<string> {
  const tmpFile = `/tmp/biome-${Date.now()}-${Math.random()}.ts`

  await Bun.write(tmpFile, code)

  try {
    const result = await Bun.$`bunx biome format --write ${tmpFile}`.nothrow()
    if (result.exitCode !== 0) {
      console.error('Biome formatting failed:', result.stderr.toString())
      return code
    }

    const formatted = await Bun.file(tmpFile).text()
    return formatted.trimEnd()
  } catch (err) {
    console.error('Biome formatting failed:', err)
    return code
  } finally {
    await Bun.$`rm -f ${tmpFile}`.quiet()
  }
}

async function processFile(filePath: string) {
  let content = await Bun.file(filePath).text()

  const matches = [...content.matchAll(CODE_BLOCK_REGEX)]
  if (matches.length === 0) return

  for (const match of matches) {
    const [fullMatch, lang, code] = match

    const formatted = await formatWithBiome(code)
    const newBlock = `\`\`\`${lang}\n${formatted}\n\`\`\``
    content = content.replace(fullMatch, newBlock)
  }

  await Bun.write(filePath, content)
  console.log(`✔ formatted ${filePath}`)
}

async function main() {
  const files = Bun.argv.slice(2)

  if (files.length === 0) {
    console.log('Usage: bun run format-md-codeblocks.ts <files>')
    process.exit(1)
  }

  for (const file of files) {
    if (file.endsWith('.md')) {
      await processFile(file)
    }
  }
}

await main()

export {}
