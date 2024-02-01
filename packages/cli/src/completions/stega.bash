#!/bin/bash

# stega autocomplete script

_stega_autocomplete() {
  local cur prev opts
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  # Main commands
  local commands="embed extract genpng"

  # Options for each command
  local embed_opts="--seed --output --force -s -o -f"
  local extract_opts="--seed --output --force -s -o -f"
  local genpng_opts="--output --force -o -f"

  # Handle file completion
  case "${COMP_WORDS[1]}" in
    embed)
      if [[ ${COMP_CWORD} == 2 || ${COMP_CWORD} == 3 ]] || [[ "${prev}" == "-o" ]]; then
        _filedir
        return 0
      elif [[ " ${embed_opts} " =~ " ${prev} " ]]; then
        return 0
      fi
      ;;
    extract)
      if [[ ${COMP_CWORD} == 2 ]] || [[ "${prev}" == "-o" ]]; then
        _filedir
        return 0
      elif [[ " ${extract_opts} " =~ " ${prev} " ]]; then
        return 0
      fi
      ;;
    genpng)
      if [[ "${prev}" == "-o" ]]; then
        _filedir
        return 0
      elif [[ " ${genpng_opts} " =~ " ${prev} " ]]; then
        return 0
      fi
      ;;
  esac

  # Complete options if current word starts with '-'
  if [[ ${cur} == -* ]] ; then
    COMPREPLY=( $(compgen -W "${embed_opts} ${extract_opts} ${genpng_opts}" -- ${cur}) )
    return 0
  fi

  # Complete main commands
  if [[ ${COMP_CWORD} == 1 ]] ; then
    COMPREPLY=( $(compgen -W "${commands}" -- ${cur}) )
    return 0
  fi
}

complete -F _stega_autocomplete stega

