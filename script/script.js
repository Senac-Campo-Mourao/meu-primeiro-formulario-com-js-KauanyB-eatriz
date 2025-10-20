function validateCPF(cpf) {
    if (!cpf) return false;
    const onlyDigits = cpf.replace(/\D+/g, '');
    if (onlyDigits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(onlyDigits)) return false;
    const digits = onlyDigits.split('').map(d => parseInt(d, 10));

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
    let rem = sum % 11;
    let check1 = (rem < 2) ? 0 : 11 - rem;
    if (check1 !== digits[9]) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
    rem = sum % 11;
    let check2 = (rem < 2) ? 0 : 11 - rem;
    if (check2 !== digits[10]) return false;

    return true;
}

const cpfInput = document.getElementById('clientCPF');
cpfInput.addEventListener('blur', function () {
    const value = cpfInput.value || '';
    const onlyDigits = value.replace(/\D+/g, '');

    if (onlyDigits.length === 0) return;
    if (!validateCPF(value)) {
        alert('CPF inválido. Por favor, verifique e digite novamente.');
    }
});

function CreditLimit(salary) {
    const salaryCents = salary.replace(/[^\d,]/g, '').replace(',', '.');
    let salaryConvertedReal = Math.round(parseFloat(salaryCents) * 100);
    let salaryCreditLimit = (salaryConvertedReal * 0.3) / 100;
    return salaryCreditLimit.toFixed(2);
}

document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('clientName').value;
    const cpf = document.getElementById('clientCPF').value;
    const telefone = document.getElementById('clientTelefone').value;
    const dateNasc = document.getElementById('clientDateNasc').value;
    const salary = document.getElementById('clientSalary').value;
    const credit = CreditLimit(salary);

    localStorage.setItem('Name', name);
    localStorage.setItem('CPF', cpf);
    localStorage.setItem('Telefone', telefone);
    localStorage.setItem('DataNasc', dateNasc);
    localStorage.setItem('Salary', salary);
    localStorage.setItem('Credit', credit);

    clearStorage();
    alert('Cliente cadastrado com sucesso!');
});

function clearStorage() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientCPF').value = '';
    document.getElementById('clientTelefone').value = '';
    document.getElementById('clientSalary').value = '';
    document.getElementById('clientDateNasc').value = '';
}

function mostrarCliente() {
    const name = localStorage.getItem('Name');
    const cpf = localStorage.getItem('CPF');
    const telefone = localStorage.getItem('Telefone');
    const dateNasc = localStorage.getItem('DataNasc');
    const salary = localStorage.getItem('Salary');
    const credit = localStorage.getItem('Credit');
    
    alert('Nome do cliente: ' + name +
        '\nCPF: ' + cpf +  
        '\nTelefone: ' + telefone +
        '\nData de Nascimento: ' + dateNasc +
        '\nSalário: R$' + salary +
        '\nCrédito Disponível: R$' + credit
    );
}