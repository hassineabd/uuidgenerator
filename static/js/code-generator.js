document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la génération des snippets de code
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
                code = `import uuid\n\n# Utiliser un UUID existant\nmy_uuid = uuid.UUID('${uuid}')\nprint(my_uuid)  # ${uuid}\n\n# Générer un nouvel UUID v4\nnew_uuid = uuid.uuid4()\nprint(new_uuid)`;
                break;
            case 'javascript':
                code = `// Utiliser un UUID existant\nconst myUuid = '${uuid}';\nconsole.log(myUuid);  // ${uuid}\n\n// Générer un nouvel UUID v4 (navigateur moderne)\nif (self.crypto && self.crypto.randomUUID) {\n  const newUuid = self.crypto.randomUUID();\n  console.log('Nouvel UUID généré:', newUuid);\n} else {\n  console.log('API crypto.randomUUID non supportée');\n}`;
                break;
            case 'java':
                code = `import java.util.UUID;\n\npublic class UUIDExample {\n    public static void main(String[] args) {\n        // Utiliser un UUID existant\n        UUID myUuid = UUID.fromString("${uuid}");\n        System.out.println(myUuid);  // ${uuid}\n        \n        // Générer un nouvel UUID v4\n        UUID randomUuid = UUID.randomUUID();\n        System.out.println("UUID généré: " + randomUuid);\n    }\n}`;
                break;
            case 'csharp':
                code = `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // Utiliser un UUID/GUID existant\n        Guid myGuid = Guid.Parse("${uuid}");\n        Console.WriteLine(myGuid);  // ${uuid}\n        \n        // Générer un nouveau GUID\n        Guid newGuid = Guid.NewGuid();\n        Console.WriteLine($"GUID généré: {newGuid}");\n    }\n}`;
                break;
            default:
                code = `// Code non disponible pour ce langage`;
        }
        
        codeSnippet.textContent = code;
    });
    
    // Copier le code
    copyCodeBtn.addEventListener('click', function() {
        const code = codeSnippet.textContent;
        
        // Créer un élément temporaire pour la copie
        const tempElement = document.createElement('textarea');
        tempElement.value = code;
        tempElement.setAttribute('readonly', '');
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        document.body.appendChild(tempElement);
        
        // Sélectionner et copier
        tempElement.select();
        document.execCommand('copy');
        
        // Nettoyer
        document.body.removeChild(tempElement);
        
        showToast('Code copié dans le presse-papiers');
    });
    
    // Toast notification (réutilisable)
    function showToast(message) {
        // Vérifier si la fonction existe déjà dans le contexte global
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