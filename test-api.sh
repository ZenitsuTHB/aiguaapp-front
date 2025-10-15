#!/bin/bash

# Script para probar los endpoints de la API

echo "🔍 Probando endpoints de la API..."
echo ""

API_URL="https://repteweb-backend.onrender.com"

echo "📊 1. Probando /consumption/summary"
curl -s "$API_URL/consumption/summary" | jq '.' || echo "❌ Error en /consumption/summary"
echo ""

echo "💧 2. Probando /consumption/"
curl -s "$API_URL/consumption/" | jq '.' || echo "❌ Error en /consumption/"
echo ""

echo "⚠️  3. Probando /anomalies/"
curl -s "$API_URL/anomalies/" | jq '.' || echo "❌ Error en /anomalies/"
echo ""

echo "✅ Pruebas completadas"
