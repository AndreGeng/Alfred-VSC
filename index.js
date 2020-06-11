const alfy = require("alfy");

let jsonPath = null;

const getConfigFile = async () => {
  const configAbs = [
    process.env.HOME + "/Library/Application Support/Code/User/projects.json",
    process.env.HOME +
      "/Library/Application Support/Code/User/globalStorage/alefragnani.project-manager/projects.json"
  ];
  let idx = 0;
  if (jsonPath) {
    delete require.cache[require.resolve(jsonPath)];
  }
  while (idx < configAbs.length) {
    try {
      const content = require(configAbs[idx]);
      jsonPath = configAbs[idx];
      return [content, configAbs[idx]];
    } catch (e) {
      if (idx === configAbs.length - 1) {
        throw new Error("project.json not found");
      }
    }
    idx++;
  }
};

(async () => {
  try {
    let projects = [];
    const [content] = await getConfigFile();
    if (content.length <= 0) {
      projects.push({
        title: "No projects found"
      });
    } else {
      projects = content.map(function(project) {
        return {
          title: project.name,
          subtitle: project.rootPath,
          valid: true,
          arg: project.rootPath
        };
      });
    }
    alfy.output(projects);
  } catch (e) {
    alfy.error(e);
  }
})();
