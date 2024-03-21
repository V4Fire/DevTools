- namespace [%fileName%]

- include 'components/form/b-select'|b as placeholder

- template index() extends ['b-select'].index
	- block nativeInput()
		< .&__value
			{{ value }}

	- block body
		< button.&__trigger @click = open
			- super
