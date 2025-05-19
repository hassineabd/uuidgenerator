document.addEventListener('DOMContentLoaded', function() {
    // Managing the generation of code snippets
    const generateCodeBtn = document.getElementById('generate-code-btn');
    const codeLanguage = document.getElementById('code-language');
    const codeSnippet = document.getElementById('code-snippet').querySelector('code');
    const copyCodeBtn = document.getElementById('copy-code');
    
    generateCodeBtn.addEventListener('click', function() {
        const uuid = document.getElementById('uuid-result').value;
        if (!uuid) return;
        
        const language = codeLanguage.value;
        let code = '';
        
        switch (language) {
            case 'python':
                code = `import uuid\n\n# Use an existing UUID\nmy_uuid = uuid.UUID('${uuid}')\nprint(my_uuid)  # ${uuid}\n\n# Generate a new UUID v4\nnew_uuid = uuid.uuid4()\nprint(new_uuid)`;
                break;
            case 'javascript':
                code = `// Use an existing UUID\nconst myUuid = '${uuid}';\nconsole.log(myUuid);  // ${uuid}\n\n// Generate a new UUID v4 (modern browser)\nif (self.crypto && self.crypto.randomUUID) {\n  const newUuid = self.crypto.randomUUID();\n  console.log('New UUID generated:', newUuid);\n} else {\n  console.log('crypto.randomUUID API not supported');\n}`;
                break;
            case 'java':
                code = `import java.util.UUID;\n\npublic class UUIDExample {\n    public static void main(String[] args) {\n        // Use an existing UUID\n        UUID myUuid = UUID.fromString("${uuid}");\n        System.out.println(myUuid);  // ${uuid}\n        \n        // Generate a new UUID v4\n        UUID randomUuid = UUID.randomUUID();\n        System.out.println("Generated UUID: " + randomUuid);\n    }\n}`;
                break;
            case 'csharp':
                code = `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // Use an existing UUID/GUID\n        Guid myGuid = Guid.Parse("${uuid}");\n        Console.WriteLine(myGuid);  // ${uuid}\n        \n        // Generate a new GUID\n        Guid newGuid = Guid.NewGuid();\n        Console.WriteLine($"Generated GUID: {newGuid}");\n    }\n}`;
                break;
            default:
                code = `// Code not available for this language`;
        }
        
        codeSnippet.textContent = code;
    });
    
    // Copy the code
    copyCodeBtn.addEventListener('click', function() {
        const code = codeSnippet.textContent;
        
        // Create a temporary element for copying
        const tempElement = document.createElement('textarea');
        tempElement.value = code;
        tempElement.setAttribute('readonly', '');
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        document.body.appendChild(tempElement);
        
        // Select and copy
        tempElement.select();
        document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(tempElement);
        
        showToast('Code copied to clipboard');
    });
    
    // Toast notification (reusable)
    function showToast(message) {
        // Check if the function already exists in the global context
        if (window.showToast) {
            window.showToast(message);
            return;
        }
        
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}); 