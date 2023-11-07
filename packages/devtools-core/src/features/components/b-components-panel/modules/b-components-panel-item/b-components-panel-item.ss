- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		{{ label }}{{ data != null ? ': ' : null }}

		< template v-if = data != null
			< template v-if = isFunction(data)
				< b-button @click = () => showFunction(data)
					Function
			< template v-else
				{{ data }}
