export default function Home() {
  const advantages = [
    "Understands your entire codebase with deep context awareness",
    "Edits files, runs commands, and executes multi-step tasks autonomously",
    "Works directly in your terminal alongside your existing tools",
    "Handles complex refactors, bug fixes, and feature additions end-to-end",
    "Supports custom slash commands, hooks, and MCP integrations",
    "Remembers project context across sessions with CLAUDE.md files",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Claude Code Advantages</h1>
      <ul className="max-w-xl list-disc space-y-3 pl-6">
        {advantages.map((advantage) => (
          <li key={advantage} className="text-lg">
            {advantage}
          </li>
        ))}
      </ul>
    </div>
  );
}
