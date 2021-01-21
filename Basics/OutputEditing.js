module.exports.capitalize = (s) => {  //Makes first Letter Uppercase
    if (typeof s !== 'string') return ''
    return s.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }