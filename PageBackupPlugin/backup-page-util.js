module.exports = {
  redirect(path, context) {
    const options = context.options;
    let queries = '';
    for (let key in options) {
      const value = options[key];
      queries += `${key}=${value}&`
    }
    queries = queries.substring(0, queries.length - 1);
    wx.redirectTo({ url: `${path}?${queries}` })
  },
}
