- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< .&__tabs
			< b-button.&__tab @click = r.router.push('components')
				Components
			< b-button.&__tab @click = r.router.push('profiler')
				Profiler
