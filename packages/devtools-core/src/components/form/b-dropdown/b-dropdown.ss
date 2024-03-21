- namespace [%fileName%]

- include 'components/form/b-select'|b as placeholder

- template index() extends ['b-select'].index
	- block input
		< .&__value
			{{ value }}
