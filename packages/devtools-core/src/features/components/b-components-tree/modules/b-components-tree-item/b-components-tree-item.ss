- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< span v-highlight = {text: label, id: value}
			{{ label }}

		< i v-if = isFunctionalProp
			{{ '<func>' }}
		< span.&__details :class = provide.elementClasses({ details: { warn: showWarning } })
			&nbsp;renderCounter = {{ renderCounterProp }}
