# stega autocomplete script for Zsh

# Autoload Zsh compinit and compdef utilities if not already done
autoload -Uz compinit && compinit
autoload -Uz bashcompinit && bashcompinit

_stega_autocomplete() {
  local -a commands
  local -a options
  local -a files
  local curcontext="$curcontext" state line
  typeset -A opt_args

  commands=(
    'embed:Embed data in an image'
    'extract:Extract data from an image'
    'genpng:Generate a PNG file'
  )

  _arguments -C \
    '1: :_describe -t commands "stega command" commands' \
    '*:: :->args'

  case $words[1] in
    embed)
      options=(
        '--seed[Seed for the random number generator]:seed:'
        '--output[Output file (use - for stdout)]:output file:_files'
        '--force[Overwrite output file if it exists]'
        '-s[Seed for the random number generator]:seed:'
        '-o[Output file (use - for stdout)]:output file:_files'
        '-f[Overwrite output file if it exists]'
      )
      _arguments $options '2:Image file:_files' '3:Data file:_files'
      ;;
    extract)
      options=(
        '--seed[Seed for the random number generator]:seed:'
        '--output[Output file (use - for stdout)]:output file:_files'
        '--force[Overwrite output file if it exists]'
        '-s[Seed for the random number generator]:seed:'
        '-o[Output file (use - for stdout)]:output file:_files'
        '-f[Overwrite output file if it exists]'
      )
      _arguments $options '2:Image file:_files'
      ;;
    genpng)
      options=(
        '--output[Output file (use - for stdout)]:output file:_files'
        '--force[Overwrite output file if it exists]'
        '-o[Output file (use - for stdout)]:output file:_files'
        '-f[Overwrite output file if it exists]'
      )
      _arguments $options '2:Width' '3:Height'
      ;;
  esac
}

compdef _stega_autocomplete stega

