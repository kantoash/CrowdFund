import { createGlobalState } from 'react-hooks-global-state'
import moment from 'moment'

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
    createModal: 'scale-0',
    updateModal: 'scale-0',
    deleteModal: 'scale-0',
    fundProject: 'scale-0',
    connectedAccount: ''
})

export {
    setGlobalState,
    getGlobalState,
    useGlobalState,
}

export const daysRemaining = (days) => {
    const todaysDate = moment()
    days = Number((days + '000').slice(0))
    days = moment(days).format('YYYY-MM-DD')
    days = moment(days)
    days = days.diff(todaysDate, 'days')
    return days == 1 ? '1 day' : days + 'days'
}

export const truncate = (text, startChars, endChars, maxLength) => {
    if (text.length > maxLength) {
      let start = text.substring(0, startChars)
      let end = text.substring(text.length - endChars, text.length)
      while (start.length + end.length < maxLength) {
        start = start + '.'
      }
      return start + end
    }
    return text
  }