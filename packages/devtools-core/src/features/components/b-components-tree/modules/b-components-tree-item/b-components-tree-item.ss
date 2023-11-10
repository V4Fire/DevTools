- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< template v-for = {text, highlight} in name
			< mark v-if = highlight | :class = provide.elementClasses({ name: { selected: isCurrentSearchMatch }})
				{{ text }}
			< span v-else
				{{ text }}

		< i v-if = isFunctionalProp
			{{ '<func>' }}
		< span.&__details :class = provide.elementClasses({ details: { warn: showWarning } })
			&nbsp;renderCounter = {{ renderCounterProp }}
