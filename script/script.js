document.addEventListener('DOMContentLoaded', function () {
    listarClientes();
    initSelect2();
});

function initSelect2() {
    const cidades = [
        'São Paulo/SP', 'Rio de Janeiro/RJ', 'Campo Mourão/PR', 'Maringá/PR', 'Londrina/PR', 'Peabiru/PR'];  

        $('#clientCity').select2({
            theme: 'bootstrap-5',
            placeholder: 'Selecione a cidade',
            allowClear: true,
            data: cidades.map(city => ({ id: city, text: city}))
        });
    }

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

function existCPFCadastrado(cpf) {
    const total = TotalyClients();  
    for (let i = 0; i < total; i++) {
        const cadsCpf = localStorage.getItem(`client_${i}_cpf`);

        if (cadsCpf === cpf){
            return true;
        }
    }
    return false;
}

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
    const city = $('#clientCity').select2('data')[0]?.text || '';
    const credit = CreditLimit(salary);

    const client = { 
        name, cpf, telefone, dateNasc, city, salary, credit
    };

    if (existCPFCadastrado(cpf) == true) {
        alert('CPF já cadastrado. Por favor, verifique e digite novamente.');
        return;
    } else{
        salveClient(client);
        clearStorage();
        alert('Cliente cadastrado com sucesso!');
    }
});

function mostrarCliente() {;
    listarClientes();
}

function TotalyClients() {
    return parseInt(localStorage.getItem('totalClients') || '0', 10);
}

function salveClient(client) {
    const index = TotalyClients();
    
    localStorage.setItem(`client_${index}_name`, client.name);
    localStorage.setItem(`client_${index}_cpf`, client.cpf);
    localStorage.setItem(`client_${index}_telefone`, client.telefone);
    localStorage.setItem(`client_${index}_dateNasc`, client.dateNasc);
    localStorage.setItem(`client_${index}_city`, client.city);
    localStorage.setItem(`client_${index}_salary`, client.salary);
    localStorage.setItem(`client_${index}_credit`, client.credit);

    localStorage.setItem('totalClients', index + 1);

    listarClientes();
}

function clearStorage() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientCPF').value = '';
    document.getElementById('clientTelefone').value = '';
    document.getElementById('clientSalary').value = '';
    document.getElementById('clientDateNasc').value = '';
}

function getClients() {
    const clients = [];
    const total = TotalyClients();

    for (let i = 0; i < total; i++) {
        const client = {
            name: localStorage.getItem(`client_${i}_name`),
            cpf: localStorage.getItem(`client_${i}_cpf`),
            telefone: localStorage.getItem(`client_${i}_telefone`), 
            dateNasc: localStorage.getItem(`client_${i}_dateNasc`),
            cidade: localStorage.getItem(`client_${i}_city`) || '',
            salary: localStorage.getItem(`client_${i}_salary`),
            credit: localStorage.getItem(`client_${i}_credit`),
        };
        clients.push(client);
    }
    return clients;
};

function formatDate(dateString) {
    if (!isNaN(dateString)) return '';
    const parts = dateString.split('-');
     if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    }
}

function listarClientes() {
    const clients = getClients();
    const tbody = document.getElementById('listaClients');
    
    tbody.innerHTML = '';
    clients.forEach(cli => { 
        const tr = document.createElement('tr');
        const date = formatDate(cli.dateNasc);
        tr.innerHTML = `
            <td>${cli.name}</td>
            <td>${cli.cpf}</td>
            <td>${cli.telefone}</td>
            <td>${date}</td>
            <td>${cli.cidade}</td>
            <td>${cli.salary}</td>
            <td>${cli.credit}</td>
        `;
        tbody.appendChild(tr);
    })
}