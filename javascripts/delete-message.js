(() => {
  'use strict'

  const isDelete = (event) => {
    if (confirm('Are you sure?')) {
      return true
    }

    event.preventDefault()
  }

  document.querySelectorAll('.w3-red')
    .forEach(currentValue => currentValue.addEventListener('click', isDelete))
})()
