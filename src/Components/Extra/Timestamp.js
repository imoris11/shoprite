import moment from 'moment'
export default function timeSince (date) {
  var seconds = Math.floor((new Date() - date) / 1000)

  var interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return moment(date).format('ll')
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return moment(date).format('ll')
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return moment(date).format('ll')
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    if(interval>=24){
      return 'Yesterday'
    }else{
      return interval + ' hrs ago'
    }
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    if (interval > 60) {
      return '1 hr'
    } else {
      return interval + ' mins ago'
    }
  }
  return 'Now'
}
