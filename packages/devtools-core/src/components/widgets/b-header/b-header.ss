- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< .&__actions
			< b-icon-button :icon = 'reload' | @click = onReload

			< b-components-actions v-if = r.activePage === 'components'

		< .&__tabs
			< b-button.&__tab @click = r.router.push('components')
				Components
			< b-button.&__tab @click = r.router.push('profiler')
				Profiler
