const findConditionalComments = require(".");

test("find conditional comments", () => {
  const comments = findConditionalComments(`
    Basic  
    <!--[if mso]><![endif]-->

    Basic multi-line
    <!--[if MAC]>
      Multi-line
    <![endif]-->

    Great than
    <!--[if gt mso 14]> Everything above Outlook 2010 <![endif]-->
    
    Less than
    <!--[if lt mso 14]> Everything below Outlook 2010 <![endif]-->
    
    Greater than or equal
    <!--[if gte mso 14]> Outlook 2010 and above <![endif]-->
    
    Less than or equal
    <!--[if lte mso 14]> Outlook 2010 and below <![endif]-->
    
    Or statement
    <!--[if (mso 12)|(mso 16)]> Outlook 2007 / 2016 only <![endif]-->
    
    And statement
    <!--[if (mso 12)&(mso 16)]> Outlook 2007 / 2016 only <![endif]-->
    
    Not statement
    <!--[if !mso]><!--> All Outlooks will ignore this <!--<![endif]-->

    Alt-syntax
    <![if mso]><![endif]>


    Not these folks. They look like they could match but don't 
    really work for some reasons.

    <!-- regular HTML comment -->
    <!--[if ]><!--> No condition <!--<![endif]-->
    <!--[if mso]
    >
      The condition is broken with a new line
    <![endif]-->
  `);

  expect(comments).toMatchSnapshot();
});
