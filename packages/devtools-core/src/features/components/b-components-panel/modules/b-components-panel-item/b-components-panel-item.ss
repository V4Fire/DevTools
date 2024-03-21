- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< .&__label
			{{ label }}

			< span v-if = data != null || Object.size(field.get('select.items')) > 0
				\:

			< span.&__warning-icon &
				v-if = warning != null |
				:-hint = warning |
				:class = provide.hintClasses('bottom-right')
			.
				< .g-icon v-icon:warning

		< b-dropdown.&__value &
			v-if = Object.size(field.get('select.items')) > 0 |
			:v-attrs = select |
			:icon = 'caret-down' |
			:cancellable = false |
			:value = data
		.

		< span.&__value v-else-if = data != null
			< template v-if = isFunction(data)
				< b-button @click = () => showFunction(data)
					Function
			< template v-else
				{{ data }}
