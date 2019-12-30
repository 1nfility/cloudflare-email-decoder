const cheerio = require('cheerio');

function decode(token) {
  const hexadecimal = (a, b) => parseInt(a.substr(b, 2), 16);
  const hexadecimalToken = hexadecimal(token);
  let decode = "";

  for (let i = 2; i < token.length; i += 2) {
    decode += String.fromCharCode(hexadecimal(token, i) ^ hexadecimalToken);
  }

  return decodeURIComponent(escape(decode));
}

/**
 * Returns cloudflare protected emails decoded.
 * @param {string} body - The website's body where cloudflare protected emails are.
 * @returns {array} Array of decoded emails.
 */
module.exports = (body) => {
  const $ = cheerio.load(body);
  const tokens = [];

  $('.__cf_email__').each((i, elem) => {
    if ($(elem).data('cfemail')) tokens.push($(elem).data('cfemail'));
  });

  return tokens.map(decode);
};