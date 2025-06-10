<template>
  <div class="container">
    <h1>Calculadora Facens</h1>
    <p class="subtitle">Calcule sua média final da Facens</p>

    <form @submit.prevent>
      <div class="grade-input">
        <label>
          AC1 - Avaliação Continuada 1
          <span class="weight">15%</span>
        </label>
        <input type="number" v-model.number="ac1" min="0" max="10" step="0.1" placeholder="Digite a nota da AC1">
      </div>

      <div class="grade-input">
        <label>
          AC2 - Avaliação Continuada 2
          <span class="weight">30%</span>
        </label>
        <input type="number" v-model.number="ac2" min="0" max="10" step="0.1" placeholder="Digite a nota da AC2">
      </div>

      <div class="grade-input">
        <label>
          AG - Avaliação Global
          <span class="weight">10%</span>
        </label>
        <input type="number" v-model.number="ag" min="0" max="10" step="0.1" placeholder="Digite a nota da AG">
      </div>

      <div class="grade-input">
        <label>
          AF - Avaliação Final
          <span class="weight">45%</span>
        </label>
        <input type="number" v-model.number="af" min="0" max="10" step="0.1" placeholder="Digite a nota da AF">
      </div>
    </form>

    <!-- Seção para mostrar quanto falta para passar -->
    <div class="prediction" v-if="hasPartialGrades && !hasAllGrades">
      <h2>🎯 Simulação para Aprovação</h2>
      <div class="current-points">
        <strong>Pontos já conquistados: {{ currentPoints.toFixed(2) }}</strong>
      </div>
      <div class="needed-points">
        <strong>Pontos necessários para passar: {{ neededPoints.toFixed(2) }}</strong>
      </div>

      <div class="scenarios">
        <h3>📈 Cenários para Aprovação (média 5.0)</h3>
        <div v-if="missingGrades.includes('ag') && missingGrades.includes('af')" class="scenario">
          <p><strong>AG e AF restantes:</strong></p>
          <p v-if="canStillPass">
            • Se tirar <strong>{{ minAGForPass.toFixed(1) }}</strong> na AG, precisa de <strong>{{
              minAFWithMinAG.toFixed(1) }}</strong> na AF
          </p>
          <p v-if="canStillPass">
            • Se tirar <strong>10.0</strong> na AG, precisa de <strong>{{ minAFWithMaxAG.toFixed(1) }}</strong> na AF
          </p>
          <p v-if="!canStillPass" class="impossible">
            ❌ Infelizmente não é mais possível atingir a média 5.0
          </p>
        </div>

        <div v-else-if="missingGrades.includes('ag')" class="scenario">
          <p><strong>Apenas AG restante:</strong></p>
          <p v-if="minGradeNeeded <= 10">
            Precisa de pelo menos <strong>{{ minGradeNeeded.toFixed(1) }}</strong> na AG
          </p>
          <p v-else class="impossible">
            ❌ Não é mais possível atingir a média 5.0
          </p>
        </div>

        <div v-else-if="missingGrades.includes('af')" class="scenario">
          <p><strong>Apenas AF restante:</strong></p>
          <p v-if="minGradeNeeded <= 10">
            Precisa de pelo menos <strong>{{ minGradeNeeded.toFixed(1) }}</strong> na AF
          </p>
          <p v-else class="impossible">
            ❌ Não é mais possível atingir a média 5.0
          </p>
        </div>
      </div>
    </div>

    <div class="result" v-if="hasAllGrades">
      <h2>🎯 Sua Média Final</h2>
      <div class="final-grade">{{ finalGrade.toFixed(2) }}</div>
      <div class="status" :class="{ approved: isApproved, reproved: !isApproved }">
        {{ isApproved ? '✅ Aprovado!' : '❌ Reprovado' }}
      </div>

      <div class="breakdown">
        <h3>📊 Detalhamento da Nota</h3>
        <div class="breakdown-item">
          <span>AC1 (15%):</span>
          <span>{{ ac1 }} × 0,15 = {{ (ac1 * 0.15).toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span>AC2 (30%):</span>
          <span>{{ ac2 }} × 0,30 = {{ (ac2 * 0.30).toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span>AG (10%):</span>
          <span>{{ ag }} × 0,10 = {{ (ag * 0.10).toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span>AF (45%):</span>
          <span>{{ af }} × 0,45 = {{ (af * 0.45).toFixed(2) }}</span>
        </div>
        <hr style="margin: 15px 0; border: 1px solid rgba(255,255,255,0.3);">
        <div class="breakdown-item" style="font-weight: bold; font-size: 1.1rem;">
          <span>Total:</span>
          <span>{{ finalGrade.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradeCalculator',
  data() {
    return {
      ac1: '',
      ac2: '',
      ag: '',
      af: ''
    }
  },
  computed: {
    finalGrade() {
      return (0.15 * this.ac1) + (0.30 * this.ac2) + (0.10 * this.ag) + (0.45 * this.af);
    },
    isApproved() {
      return this.finalGrade >= 4.76;
    },
    hasAllGrades() {
      return this.ac1 !== '' && this.ac2 !== '' && this.ag !== '' && this.af !== '';
    },
    hasPartialGrades() {
      return this.ac1 !== '' || this.ac2 !== '' || this.ag !== '' || this.af !== '';
    },
    currentPoints() {
      let points = 0;
      if (this.ac1 !== '') points += 0.15 * this.ac1;
      if (this.ac2 !== '') points += 0.30 * this.ac2;
      if (this.ag !== '') points += 0.10 * this.ag;
      if (this.af !== '') points += 0.45 * this.af;
      return points;
    },
    neededPoints() {
      return Math.max(0, 4.76 - this.currentPoints);
    },
    missingGrades() {
      const missing = [];
      if (this.ac1 === '') missing.push('ac1');
      if (this.ac2 === '') missing.push('ac2');
      if (this.ag === '') missing.push('ag');
      if (this.af === '') missing.push('af');
      return missing;
    },
    remainingWeight() {
      let weight = 0;
      if (this.ag === '') weight += 0.10;
      if (this.af === '') weight += 0.45;
      return weight;
    },
    canStillPass() {
      return this.remainingWeight * 10 >= this.neededPoints;
    },
    minGradeNeeded() {
      if (this.missingGrades.length === 1) {
        if (this.missingGrades.includes('ag')) {
          return this.neededPoints / 0.10;
        } else if (this.missingGrades.includes('af')) {
          return this.neededPoints / 0.45;
        }
      }
      return 0;
    },
    minAGForPass() {
      const maxAFPoints = 0.45 * 10;
      const pointsFromAG = Math.max(0, this.neededPoints - maxAFPoints);
      return pointsFromAG / 0.10;
    },
    minAFWithMinAG() {
      const agPoints = 0.10 * this.minAGForPass;
      const neededFromAF = this.neededPoints - agPoints;
      return Math.max(0, neededFromAF / 0.45);
    },
    minAFWithMaxAG() {
      const agPoints = 0.10 * 10;
      const neededFromAF = this.neededPoints - agPoints;
      return Math.max(0, neededFromAF / 0.45);
    }
  }
}
</script>