/* generation options */
const html2mdDefinitions = [
  {
    name: 'files',
    alias: 'f',
    type: String,
    multiple: true,
    defaultOption: true,
    description: 'A list of html2md explain files (or glob expressions) to parse for documentation. Either this or [bold]{--source} must be supplied.',
    typeLabel: '[underline]{file} ...'
  },
  {
    name: 'help',
    description: 'Print usage information',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'config',
    description: 'Print all options supplied (from command line, `.html2md.json` or `package.json` under the `html2md` property) and exit. Useful for checking the tool is receiving the correct config.',
    type: Boolean
  },
  { name: 'version', type: Boolean },
]

module.exports = {
  definitions: html2mdDefinitions,
  usageSections: [
    {
      header: 'html-to-markdown',
      content: 'Generates markdown documentation from html source code.'
    },
    {
      header: 'Synopsis',
      content: [
        {
          cmmd: '$ html2md [bold]{--help}'
        },
        {
          cmmd: '$ html2md [bold]{--config}'
        }
      ]
    },
    {
      header: 'General options',
      content: 'Main options affecting mode. If none of the following are supplied, the tool will generate markdown docs.'
    }
  ]
}
