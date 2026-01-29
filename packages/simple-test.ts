import pico from 'picocolors'

type SyncAsyncFunc = (() => void) | (() => Promise<void>)

const __TEST_INFO__: {
  current?: { name: string; its: { name: string; func: SyncAsyncFunc }[] }
  describes: { name: string; its: { name: string; func: SyncAsyncFunc }[] }[]
} = {
  current: undefined,
  describes: [],
}

export function describe(name: string, func: () => void) {
  __TEST_INFO__.current = { name, its: [] }

  func()

  __TEST_INFO__.describes.push(__TEST_INFO__.current)
  __TEST_INFO__.current = undefined
}

export function it(name: string, func: SyncAsyncFunc) {
  if (__TEST_INFO__.current) {
    __TEST_INFO__.current.its.push({ name, func })
  } else {
    const desc = {
      name: '',
      its: [{ name, func }],
    }

    __TEST_INFO__.describes.push(desc)
  }
}

export async function runTest() {
  let currentItName = ''

  try {
    while (__TEST_INFO__.describes.length > 0) {
      const desc = __TEST_INFO__.describes.shift()

      if (!desc) {
        return
      }

      const descName = desc.name
      const its = desc.its

      if (descName) {
        console.log('  ' + descName)
      }

      for (const item of its) {
        currentItName = item.name
        const func = item.func

        process.stdout.write(pico.yellow('    = ') + currentItName + '\r')

        const start = Date.now()

        await func()

        if (currentItName) {
          console.log(pico.green('    \u2713 ') + currentItName + pico.green(` (${Date.now() - start}ms)`))
        }
      }

      console.log()
    }

    console.log('  ' + pico.bgGreen(' PASS ') + '\n')
  } catch (inErr) {
    console.log(pico.red('    \u2717 ') + currentItName + '\n')
    console.log(pico.yellow((inErr as Error).message) + '\n')
    console.log('  ' + pico.bgRed(' FAIL ') + '\n')

    process.exit(0)
  }
}

export function expect(actualValue: any) {
  return {
    toBe: (value: any) => {
      if (value !== actualValue) {
        throw new Error(`  Expect: ${value}\n  Actual: ${actualValue}`)
      }
    },
    toBeGreaterThan: (value: any) => {
      const result = actualValue > value

      if (!result) {
        throw new Error(`  Expect: ${actualValue} > ${value}\n  Actual: ${actualValue} <= ${value}`)
      }
    },
    toBePlainArrayEqual: (value: any[]) => {
      const len = value.length

      if ((actualValue as any[]).length !== value.length) {
        throw new Error(`  toBeArrayEqual\n  length not equal`)
      }

      // use .map() avoid to change original array
      const a = (actualValue as any[]).map(i => i).sort()
      const b = value.map(i => i).sort()

      for (let i = 0; i < len; i++) {
        const pA = a.pop()
        const pB = b.pop()

        if (pA !== pB) {
          throw new Error(`  toBeArrayEqual\n  Expect: ${pA}\n  !==\n  Actual: ${pB}`)
        }
      }
    },
    toBeTruthy: () => {
      if (!actualValue) {
        throw new Error(`  Expect: Truthy: ${actualValue}\n  Actual: Falsy: ${actualValue}`)
      }
    },
    toHaveProperties: (...args: string[]) => {
      for (const arg of args) {
        if (!(actualValue as object).hasOwnProperty(arg)) {
          throw new Error(
            `  Expect: '${arg}'\n  Actual: ${Object.keys(actualValue as object)
              .map(i => `'${i}'`)
              .join(' ')}`,
          )
        }
      }
    },
  }
}
