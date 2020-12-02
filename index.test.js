const findConditionalComments = require(".");

test("get valid conditional comments", () => {
  console.log(
    findConditionalComments(`
    <!--[if mso]><![endif]-->
  `)
  );
});
