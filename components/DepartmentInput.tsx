import {useCallback, useMemo, useState} from 'react'
import type {ChangeEvent, FocusEvent, KeyboardEvent} from 'react'
import {Box, Card, Stack, Text, TextInput} from '@sanity/ui'
import {set, unset, type StringInputProps} from 'sanity'

function listValue(option: unknown): string {
  if (typeof option === 'string') return option
  if (option && typeof option === 'object' && 'value' in option) {
    return String((option as {value: unknown}).value)
  }
  return String(option)
}

export function DepartmentInput(props: StringInputProps) {
  const {elementProps, onChange, readOnly, schemaType, validationError, value} = props
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const current = typeof value === 'string' ? value : ''

  const suggestions = useMemo(() => {
    const list = schemaType.options?.list
    return Array.isArray(list) ? list.map(listValue) : []
  }, [schemaType])

  const matches = useMemo(() => {
    const query = current.trim().toLowerCase()
    return suggestions.filter((suggestion) => suggestion.toLowerCase().includes(query))
  }, [current, suggestions])

  const open = focused && !readOnly && matches.length > 0
  const active = activeIndex >= matches.length ? -1 : activeIndex

  const choose = useCallback(
    (next: string) => {
      onChange(set(next))
      setActiveIndex(-1)
      setFocused(false)
    },
    [onChange],
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.currentTarget.value
      onChange(next === '' ? unset() : set(next))
      setActiveIndex(-1)
    },
    [onChange],
  )

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      elementProps.onFocus(event)
    },
    [elementProps],
  )

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      elementProps.onBlur(event)
    },
    [elementProps],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setFocused(false)
        setActiveIndex(-1)
        return
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        setFocused(true)
        setActiveIndex((index) => {
          const next = event.key === 'ArrowDown' ? index + 1 : index - 1
          if (next < 0) return matches.length - 1
          if (next > matches.length - 1) return 0
          return next
        })
        return
      }
      if (event.key === 'Enter' && active >= 0 && matches[active]) {
        event.preventDefault()
        choose(matches[active])
      }
    },
    [active, choose, matches],
  )

  return (
    <Box style={{position: 'relative'}}>
      <TextInput
        {...elementProps}
        value={current}
        customValidity={validationError}
        placeholder="Ketik bebas, atau pilih dari daftar"
        autoComplete="off"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {open && (
        <Box
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 20,
            marginTop: 4,
            maxHeight: 260,
            overflowY: 'auto',
          }}
          // Keep focus on the input so the click lands before blur closes the menu.
          onMouseDown={(event) => event.preventDefault()}
        >
          <Card border padding={2} radius={2} shadow={1}>
            <Stack gap={1}>
              {matches.map((suggestion, index) => (
                <Card
                  key={suggestion}
                  as="button"
                  type="button"
                  padding={3}
                  radius={1}
                  tone={index === active ? 'primary' : 'transparent'}
                  style={{width: '100%', textAlign: 'left', cursor: 'pointer'}}
                  onClick={() => choose(suggestion)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <Text size={1} textOverflow="ellipsis">
                    {suggestion}
                  </Text>
                </Card>
              ))}
            </Stack>
          </Card>
        </Box>
      )}
    </Box>
  )
}
