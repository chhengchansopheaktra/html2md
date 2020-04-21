#!/usr/bin/env node
const tool = require("command-line-tool");
const version = require("../package").version;

const cli = parseCommandLine();
let options = cli.options;
options = loadStoredConfig(options);

/* html2md --help */
if (options.help) {
  tool.printOutput(cli.usage);

  /* html2md --version */
} else if (options.version) {
  tool.printOutput(version);
} else {
  /* html2md --config */
  if (options.config) {
    const omit = require("lodash.omit");
    tool.stop(JSON.stringify(omit(options, "config"), null, "  "));
  }

  /* input files (html2md-options) required from here */
  /* input validation */
  try {
    const assert = require("assert");
    options.files = options.files || [];
    assert.ok(
      options.files.length || options.source,
      "Must supply either --files or --source"
    );
  } catch (err) {
    tool.printOutput(cli.usage);
    handleError(err);
  }

  var TurndownService = require("turndown");
  var path = require("path");
  var fs = require("fs");

  var moveTo = "docs";

  // Loop through all the files in the temp directory
  options.files.forEach(function (file, index) {
    // Make one pass and make the file complete

    fs.stat(file, function (error, stat) {
      if (error) {
        console.error("Error stating file.", error);
        return;
      }

      if (stat.isFile()) {
        fs.readFile(file, "utf8", function (err, html) {
          if (err) {
            throw err;
          }
          var turndownService = new TurndownService();
          turndownService.addRule("head", {
            filter: ["head", "style", "meta"],
            replacement: function (content, node) {
              console.log(content)
              return "";
            },
          });

          turndownService.addRule("title", {
            filter: ["title"],
            replacement: function (content, node) {
              return (`---\nid: ${file
                .replace(/^.*[\\\/]/, "")
                .replace(
                  ".html",
                  ""
                )}\ntitle: ${content}\nsidebar_label: ${content}\n---\n* * *`);
            },
          });

          var toFile = path
            .join(moveTo, file.replace(/^.*[\\\/]/, ""))
            .replace(".html", ".md");
          var markdown = turndownService.turndown(html);
          markdown = markdown.replace(' ---', '---')
          fs.writeFileSync(toFile, markdown);
        });
      } else if (stat.isDirectory()) {
        console.log("'%s' is a directory.", file);
      }
    });
  });
}

function loadStoredConfig(options) {
  const loadConfig = require("config-master");
  const html2mdConfig = loadConfig("html2md");
  return Object.assign(html2mdConfig, options);
}

function parseCommandLine() {
  const cliData = require("../lib/cli-data");
  try {
    return tool.getCli(cliData.definitions, cliData.usageSections);
  } catch (err) {
    handleError(err);
  }
}

function handleError(err) {
  tool.halt(err.toString());
}
