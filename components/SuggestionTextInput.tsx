import {useCallback, useMemo, useState} from 'react'
import type {ChangeEvent, FocusEvent, KeyboardEvent} from 'react'
import {Box, Card, Stack, Text, TextInput} from '@sanity/ui'
import {set, unset, type StringInputProps} from 'sanity'

export type Suggestion = string | {title: string; value: string}

type SuggestionTextInputProps = StringInputProps & {
  suggestions?: Suggestion[]
}

type Choice = {label: string; value: string}

function toChoices(suggestions: Suggestion[]): Choice[] {
  return suggestions.map((suggestion) =>
    typeof suggestion === 'string'
      ? {label: suggestion, value: suggestion}
      : {label: suggestion.title, value: suggestion.value},
  )
}

/**
 * Free-text string input with a dropdown of suggestions.
 *
 * The suggestions arrive as a prop, never through `options.list`: Sanity turns a
 * string field with `options.list` into a union of those values
 * (`createStringTypeNodeDefintion`), so anything typed outside the list is
 * rejected with "did not match any allowed values" — no custom input can
 * override that.
 */
export function SuggestionTextInput(props: SuggestionTextInputProps) {
  const {elementProps, onChange, readOnly, suggestions = [], validationError, value} = props
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const current = typeof value === 'string' ? value : ''

  const choices = useMemo(() => toChoices(suggestions), [suggestions])

  const matches = useMemo(() => {
    const query = current.trim().toLowerCase()
    return choices.filter((choice) => choice.label.toLowerCase().includes(query))
  }, [choices, current])

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
        choose(matches[active].value)
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
              {matches.map((choice, index) => (
                <Card
                  key={choice.value}
                  as="button"
                  type="button"
                  padding={3}
                  radius={1}
                  tone={index === active ? 'primary' : 'transparent'}
                  style={{width: '100%', textAlign: 'left', cursor: 'pointer'}}
                  onClick={() => choose(choice.value)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <Text size={1} textOverflow="ellipsis">
                    {choice.label}
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

/**
 * Builds the `components.input` for a field. Exists so the `.ts` schema files
 * can wire up suggestions without JSX.
 */
export function suggestionInput(suggestions: Suggestion[]) {
  return function SuggestionInput(props: StringInputProps) {
    return <SuggestionTextInput {...props} suggestions={suggestions} />
  }
}
