// src/utils/formatters.js - Funções de formatação

/**
 * Formata uma data do Firestore ou string para exibição
 * Suporta: Firestore Timestamp {_seconds, _nanoseconds}, {seconds, nanoseconds}, Date, string
 * @param {any} date - Data em qualquer formato
 * @param {string} format - Formato de saída ('short', 'long', 'full', 'time')
 * @returns {string} - Data formatada ou string vazia
 */
export function formatDate(date, format = 'short') {
  if (!date) return '';
  
  let dateObj;
  
  // Firestore Timestamp com _seconds
  if (date?._seconds !== undefined) {
    dateObj = new Date(date._seconds * 1000);
  }
  // Firestore Timestamp com seconds
  else if (date?.seconds !== undefined) {
    dateObj = new Date(date.seconds * 1000);
  }
  // Já é Date
  else if (date instanceof Date) {
    dateObj = date;
  }
  // String ou número
  else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  }
  // Objeto com toDate() (Firestore client-side)
  else if (typeof date?.toDate === 'function') {
    dateObj = date.toDate();
  }
  else {
    return String(date);
  }

  // Verifica se a data é válida
  if (isNaN(dateObj.getTime())) {
    return String(date);
  }

  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
    full: { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    time: { hour: '2-digit', minute: '2-digit' },
    monthYear: { month: 'long', year: 'numeric' },
  };

  return dateObj.toLocaleDateString('pt-BR', options[format] || options.short);
}

/**
 * Formata um valor para moeda brasileira
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: R$ 1.234,56)
 */
export function formatCurrency(value) {
  const num = parseFloat(value) || 0;
  return num.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
}

/**
 * Formata número de telefone brasileiro
 * @param {string} phone - Telefone
 * @returns {string} - Telefone formatado
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Formata CPF
 * @param {string} cpf - CPF
 * @returns {string} - CPF formatado (ex: 123.456.789-00)
 */
export function formatCPF(cpf) {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  return cpf;
}

/**
 * Formata placa de veículo
 * @param {string} placa - Placa
 * @returns {string} - Placa formatada (ex: ABC-1234 ou ABC1D23)
 */
export function formatPlaca(placa) {
  if (!placa) return '';
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export default {
  formatDate,
  formatCurrency,
  formatPhone,
  formatCPF,
  formatPlaca,
};
