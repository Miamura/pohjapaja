// occt-import-js ei toimita omia tyyppejä — minimaalinen ambient-määrittely
// sille mitä käytämme (STEP -> mesh-attribuutit).
declare module 'occt-import-js' {
  interface OcctAttribute {
    array: number[]
  }
  interface OcctMesh {
    name?: string
    color?: [number, number, number]
    attributes: { position: OcctAttribute; normal?: OcctAttribute }
    index?: { array: number[] }
  }
  interface OcctResult {
    success: boolean
    root?: unknown
    meshes: OcctMesh[]
  }
  interface OcctModule {
    ReadStepFile(content: Uint8Array, params: unknown): OcctResult
  }
  interface OcctFactoryOptions {
    locateFile?: (path: string) => string
  }
  export default function occtimportjs(options?: OcctFactoryOptions): Promise<OcctModule>
}
