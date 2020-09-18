export default ({
  dependencies: {
    templates,
    runTemplate
  }
}) => async ({ template, name }) => {
  if (templates[template]) {
    const formedTemplate = await templates[template]({ name })
    runTemplate(formedTemplate)
  } else {
    throw new Error(`Unsupported template type ${template}`)
  }
}
