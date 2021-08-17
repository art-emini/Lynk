[ -d "./db" ] && echo "Directory db DOES exist. Skipping"
[ ! -d "./db" ] && echo "Directory db DOES NOT exist. Creating.." && mkdir db && touch ./db/lynks.json  ./db/users.json && echo "[]" > "./db/lynks.json" && echo "[]" > "./db/users.json"

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