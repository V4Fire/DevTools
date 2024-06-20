- namespace [%fileName%]

- include 'components/super/i-static-page/i-static-page.component.ss'|b as placeholder

- template index() extends ['i-static-page.component'].index
	- block helpers
		- block router
			< b-router &
				v-once |
				:initialRoute = "components" |
				:engine = routerEngine
			.


	- block body
		< h1 v-if = placeholder
			{{ placeholder }}
		< template v-else
			- block header
				< b-header ref = header
			- block page
					< b-dynamic-page.&__page ref = page
