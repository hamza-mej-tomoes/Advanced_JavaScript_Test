const developers = [
  { name: 'Alice', skillLevel: 7, maxHours: 40, preferredTaskType: 'feature' },
  { name: 'Bob', skillLevel: 9, maxHours: 30, preferredTaskType: 'bug' },
  { name: 'Charlie', skillLevel: 5, maxHours: 35, preferredTaskType: 'refactor' },
];

const tasks = [
  { taskName: 'Feature A', difficulty: 7, hoursRequired: 15, taskType: 'feature', priority: 4, dependencies: [] },
  { taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, taskType: 'bug', priority: 5, dependencies: [] },
  { taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, taskType: 'refactor', priority: 3, dependencies: ['Bug Fix B'] },
  { taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, taskType: 'feature', priority: 2, dependencies: [] },
  { taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, taskType: 'feature', priority: 5, dependencies: ['Feature A'] },
];

function assignTasksWithPriorityAndDependencies(developers, tasks) {
  tasks.sort((a, b) => b.priority - a.priority);

  const developerTasks = developers.map(dev => ({
    ...dev,
    assignedTasks: [],
    totalHours: 0
  }));
  const unassignedTasks = [];

  const completedTasks = new Set();

  for (const task of tasks) {
    let taskAssigned = false;

    for (const dev of developerTasks) {
      if (
        dev.skillLevel >= task.difficulty &&
        dev.totalHours + task.hoursRequired <= dev.maxHours &&
        (dev.preferredTaskType === task.taskType || dev.preferredTaskType === null)
      ) {
        const dependenciesMet = task.dependencies.every(dep => completedTasks.has(dep));

        if (dependenciesMet) {
          dev.assignedTasks.push(task.taskName);
          dev.totalHours += task.hoursRequired;
          completedTasks.add(task.taskName);
          taskAssigned = true;
          break;
        }
      }
    }

    if (!taskAssigned) {
      unassignedTasks.push(task.taskName);
    }
  }

  return { developers: developerTasks, unassignedTasks };
}

const result = assignTasksWithPriorityAndDependencies(developers, tasks);

// Display the result in the HTML
const resultsDiv = document.getElementById("results");

result.developers.forEach(dev => {
  const devInfo = document.createElement("div");
  devInfo.innerHTML = `
    <h3>${dev.name}</h3>
    <p>Skill Level: ${dev.skillLevel}</p>
    <p>Max Hours: ${dev.maxHours}</p>
    <p>Assigned Tasks: ${dev.assignedTasks.join(", ") || "None"}</p>
    <p>Total Hours Assigned: ${dev.totalHours}</p>
  `;
  resultsDiv.appendChild(devInfo);
});

const unassignedInfo = document.createElement("div");
unassignedInfo.innerHTML = `
  <h3>Unassigned Tasks</h3>
  <p>${result.unassignedTasks.join(", ") || "All tasks assigned"}</p>
`;
resultsDiv.appendChild(unassignedInfo);
