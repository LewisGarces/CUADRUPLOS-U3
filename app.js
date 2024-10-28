const expresionValida = /^(?!-)[\d\s\+\-\*\/\(\)]+$/;

// Función para validar la expresión matemática
function validarExpresion(expresion) {
    if (!expresionValida.test(expresion)) {
        swal("Error", "La expresión solo puede contener números positivos, operadores (+, -, *, /) y paréntesis. No se permiten letras o caracteres especiales.", "error");
        return false;
    }
    return true;
}

// Función para generar cuádruplos de una expresión matemática
function generarCuadruplos(expresionMatematica) {
    const operadores = [];
    const operandos = [];
    const cuadruplos = [];

    // Función de ayuda para definir la precedencia
    const precedencia = (operador) => {
        switch (operador) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
                return 2;
            default:
                return 0;
        }
    };

    // Función para procesar los operadores y generar cuádruplos
    const procesarOperador = () => {
        const operacion = operadores.pop();
        const operandoDerecho = operandos.pop();
        const operandoIzquierdo = operandos.pop();
        let resultado;

        // Calcular el resultado de la operación
        if (operacion === '+') {
            resultado = Number(operandoIzquierdo) + Number(operandoDerecho);
        } else if (operacion === '-') {
            resultado = Number(operandoIzquierdo) - Number(operandoDerecho);
        } else if (operacion === '*') {
            resultado = Number(operandoIzquierdo) * Number(operandoDerecho);
        } else if (operacion === '/') {
            resultado = Number(operandoIzquierdo) / Number(operandoDerecho);
        }

        cuadruplos.push({
            operador: operacion,
            operando1: operandoIzquierdo,
            operando2: operandoDerecho,
            resultado: resultado
        });

        operandos.push(resultado.toString()); // Usar el resultado como nuevo operando y convertir a string
    };

    // Recorre la expresión
    for (let i = 0; i < expresionMatematica.length; i++) {
        const caracter = expresionMatematica[i];

        if (caracter === ' ') continue; // Ignorar espacios

        if (!isNaN(caracter)) {
            // Acumula números completos
            let numero = caracter;
            while (!isNaN(expresionMatematica[i + 1])) {
                numero += expresionMatematica[++i];
            }
            operandos.push(numero);
        } else if (caracter === '(') {
            operadores.push(caracter);
        } else if (caracter === ')') {
            while (operadores.length && operadores[operadores.length - 1] !== '(') {
                procesarOperador();
            }
            operadores.pop(); // Remover el paréntesis de apertura
        } else if ("+-*/".includes(caracter)) {
            while (
                operadores.length &&
                precedencia(operadores[operadores.length - 1]) >= precedencia(caracter)
            ) {
                procesarOperador();
            }
            operadores.push(caracter);
        }
    }

    // Procesar los operadores restantes
    while (operadores.length) {
        procesarOperador();
    }

    return cuadruplos;
}

// Manejo del botón Evaluar
document.getElementById("btnEvaluar").addEventListener("click", function(event) {
    event.preventDefault(); // Evitar recarga de página

    const expresion = document.getElementById("inputExpresion").value;

    if (!expresion) {
        swal("Error", "Por favor ingrese una expresión matemática.", "error");
        return;
    }

    // Validar expresión antes de evaluar
    if (!validarExpresion(expresion)) {
        return;
    }

    // Validar que la expresión no termine con un operador
    const ultCaracter = expresion.trim().slice(-1);
    if ("+-*/".includes(ultCaracter)) {
        swal("Error", "Por favor ingrese una expresión completa. No debe terminar con un operador.", "error");
        return;
    }

    const cuadruplosGenerados = generarCuadruplos(expresion);
    let resultadoHTML = "<h3>Cuádruplos Generados:</h3><table class='table table-dark'><tr><th>Operador</th><th>Operando 1</th><th>Operando 2</th><th>Resultado</th></tr>";

    cuadruplosGenerados.forEach(cuadruplo => {
        resultadoHTML += `<tr>
            <td>${cuadruplo.operador}</td>
            <td>${cuadruplo.operando1}</td>
            <td>${cuadruplo.operando2}</td>
            <td>${cuadruplo.resultado}</td>
        </tr>`;
    });
    resultadoHTML += "</table>";

    document.getElementById("contenedorResultados").innerHTML = resultadoHTML;
    
    swal("Expresión generada con éxito", "Los cuádruplos se generaron correctamente.", "success");
});

// Manejo del botón Limpiar
document.getElementById("btnLimpiar").addEventListener("click", function(event) {
    event.preventDefault(); // Evitar recarga de página
    
    document.getElementById("inputExpresion").value = ""; // Limpiar el campo de entrada
    document.getElementById("contenedorResultados").innerHTML = ""; // Limpiar los resultados generados
    swal("Limpiado", "Se ha limpiado la expresión y los resultados.", "success");
});

