import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

const run = async () => {
  await connectDB();

  // Buscar todos os alunos
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const alunos = await User.find({ role: 'aluno' }).select('name email enrolledCohorts').lean();

  console.log('=== ALUNOS ===');
  alunos.forEach(aluno => {
    console.log(`- ${aluno.name} (${aluno.email})`);
    console.log(`  enrolledCohorts: ${JSON.stringify(aluno.enrolledCohorts)}`);
  });

  // Buscar todas as turmas
  const Cohort = mongoose.model('Cohort', new mongoose.Schema({}, { strict: false }));
  const turmas = await Cohort.find({}).select('name code status students').lean();

  console.log('\n=== TURMAS ===');
  turmas.forEach(turma => {
    console.log(`- ${turma.name} (${turma.code}) - Status: ${turma.status}`);
    console.log(`  Alunos: ${turma.students?.length || 0}`);
    console.log(`  IDs: ${JSON.stringify(turma.students)}`);
  });

  await mongoose.disconnect();
};

run().catch(console.error);
