const CONDITIONAL_COMMENT_REGEX = /(<!(--)?\[if\s[()\w\s|&!]+\]>(?:<!--+>)?)(.*?)(<!\[endif\]\2>)/gi;
const parse = require("./parse-condition");

function findConditionalComments(str) {
  let comments = [];

  let result;
  while ((result = CONDITIONAL_COMMENT_REGEX.exec(str)) !== null) {
    const [match, start, commentDashes, content, end] = result;

    comments.push({
      start,
      end,
      range: [
        CONDITIONAL_COMMENT_REGEX.lastIndex - match.length,
        CONDITIONAL_COMMENT_REGEX.lastIndex,
      ],
    });
  }

  comments = comments.map((comment) => ({
    ...comment,
    conditions: parse(comment.start),
  }));

  return comments;
}

const { Engine } = require("json-rules-engine");
const engine = new Engine();

console.log(
  JSON.stringify(
    findConditionalComments(`
<!--[if (mso 12 & MAC) | mso 16]> Outlook 2007 / 2016 only <![endif]--> ok
`),
    null,
    2
  )
);

// findConditionalComments(`
// <!--[if (mso 12 & MAC) | mso 16]> Outlook 2007 / 2016 only <![endif]--> ok
// `).map((comment, i) => {
//   console.log(comment.conditions);

//   engine.addRule({
//     conditions: comment.conditions,
//     event: { type: `render-${i}` },
//   });
// });

// engine.run({ mso: "12", MAC: false, WIN: false }).then(({ events }) => {
//   console.log(events);
// });

// console.log(JSON.stringify(findConditionalComments(`
// <!--[if (mso 12)|((mso 16) && MAC)]> Outlook 2007 / 2016 only <![endif]--> ok
// `), null, 2))

// console.log(findConditionalComments(`
// <!--[if gt mso 14]> Everything above Outlook 2010 <![endif]--> ok
// <!--[if lt mso 14]> Everything below Outlook 2010 <![endif]--> ok
// <!--[if gte mso 14]> Outlook 2010 and above <![endif]--> ok
// <!--[if lte mso 14]> Outlook 2010 and below <![endif]--> ok
// <!--[if (mso 12)|(mso 16)]> Outlook 2007 / 2016 only <![endif]--> ok
// <!--[if !mso]><!--> All Outlooks will ignore this <!--<![endif]--> ok
// `))
