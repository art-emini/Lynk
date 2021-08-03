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