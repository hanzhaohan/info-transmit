import Vue from 'vue'
import dateFormat from 'date-fns/format'

Vue.filter('date-format', function (value, formatStr='YYYY-MM-DD HH:mm:ss') {
    // return moment(value).format(formatStr)
    return dateFormat(value, formatStr)
  })


