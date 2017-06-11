#!/usr/bin/env node

var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
var projectsJson;
(function main() {
    // --- simple example of using action handler
    actionHandler.onAction("projects", function (query) {
        var projects = [];
        var file = process.env.HOME + '/Library/Application Support/Code/User/projects.json';
        if (projectsJson) {
            delete require.cache[require.resolve(file)];
        }
        try {
            projectsJson = require(file);
            if (projectsJson.length <= 0) {
                projects.push({
                    title: 'No projects found',
                });
            } else {
                projects = projectsJson.map(function (project) {
                    var rootPath = project.rootPath.replace('$home', require('os').homedir());
                    return {
                        title: project.name,
                        subtitle: rootPath,
                        valid: true,
                        arg: rootPath,
                    }
                });
            }
        } catch (e) {
            // no projects.json file found;
            projects.push({
                tilte: 'No projects file found',
                subtitle: file,
            });
        }

        projects.forEach(function (project) {
            workflow.addItem(new AlfredNode.Item(project));
        });

        // generate feedbacks
        workflow.feedback();
    });

    AlfredNode.run();
})();