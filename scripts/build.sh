[ ! -d "./db" ] && echo "Directory db DOES NOT exist. Creating.." && mkdir db && touch ./db/lynks.json  ./db/users.json
[ -d "./db" ] && echo "Directory db DOES exist. Skipping"

echo "Linting"
npm run lint
echo "Fixing"
npm run lint:fix
echo "Fixed"

echo "Formatting"
npm run format
echo "Formatted"

echo "Compiling"
tsc
echo "Compiled"