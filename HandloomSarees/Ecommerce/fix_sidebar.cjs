const fs = require('fs');
let code = fs.readFileSync('src/components/ui/sidebar.tsx', 'utf8');
const searchStr = `    const width = React.useMemo(() => {
        return \`\${Math.floor(Math.random() * 40) + 50}%\`
    }, [])`;
const replaceStr = `    const [width, setWidth] = React.useState("70%")
    React.useEffect(() => {
        setWidth(\`\${Math.floor(Math.random() * 40) + 50}%\`)
    }, [])`;
code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/components/ui/sidebar.tsx', code);
