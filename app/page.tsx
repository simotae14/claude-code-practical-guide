export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold mb-6">Hello World</h1>
        <h2 className="text-2xl font-semibold mb-4">Advantages of Claude Code</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Understands and navigates large codebases with full context</li>
          <li>Runs terminal commands, tests, and builds directly in your environment</li>
          <li>Edits multiple files across the project in a single step</li>
          <li>Works inside your existing IDE without switching tools</li>
          <li>Supports custom workflows via hooks, slash commands, and MCP servers</li>
          <li>Keeps a persistent memory of project context across sessions</li>
          <li>Handles entire features end-to-end, from planning to implementation</li>
        </ul>
      </div>
    </div>
  );
}
