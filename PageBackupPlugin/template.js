const { redirect } = require('../../backup-page-util');
Page({
    onLoad() {
      redirect(routePath, this)
    },
  }
)
