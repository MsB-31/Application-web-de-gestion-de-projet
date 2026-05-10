<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskHistory;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $jean = User::create([
            'nom'      => 'Dupont',
            'prenom'   => 'Jean',
            'email'    => 'jean@ds.com',
            'password' => Hash::make('password'),
            'role'     => 'Chef de projet',
        ]);

        $sophie = User::create([
            'nom'      => 'Martin',
            'prenom'   => 'Sophie',
            'email'    => 'sophie@ds.com',
            'password' => Hash::make('password'),
            'role'     => 'Développeur',
        ]);

        $lucas = User::create([
            'nom'      => 'Dubois',
            'prenom'   => 'Lucas',
            'email'    => 'lucas@ds.com',
            'password' => Hash::make('password'),
            'role'     => 'Designer',
        ]);

        $emma = User::create([
            'nom'      => 'Bernard',
            'prenom'   => 'Emma',
            'email'    => 'emma@ds.com',
            'password' => Hash::make('password'),
            'role'     => 'DevOps',
        ]);

        $demo = User::create([
            'nom'      => 'Dupont',
            'prenom'   => 'Jean',
            'email'    => 'demo@digitalsolutions.fr',
            'password' => Hash::make('demo1234'),
            'role'     => 'Chef de projet',
        ]);

        $p1 = Project::create([
            'nom'         => 'Refonte Site Vitrine',
            'description' => 'Modernisation complète du site corporate avec nouveau design et CMS headless.',
            'statut'      => 'ACTIF',
            'date_debut'  => '2024-01-15',
            'date_fin'    => '2024-06-30',
            'chef_id'     => $jean->id,
        ]);

        DB::table('project_members')->insert([
            ['project_id' => $p1->id, 'user_id' => $jean->id,   'created_at' => now()],
            ['project_id' => $p1->id, 'user_id' => $sophie->id, 'created_at' => now()],
            ['project_id' => $p1->id, 'user_id' => $lucas->id,  'created_at' => now()],
        ]);

        $t1 = Task::create([
            'project_id'    => $p1->id,
            'titre'         => 'Maquettes Figma',
            'description'   => 'Créer les maquettes desktop et mobile.',
            'statut'        => 'TERMINE',
            'priorite'      => 'HAUTE',
            'assigne_a_id'  => $lucas->id,
            'date_echeance' => '2024-02-15',
        ]);

        Task::create([
            'project_id'    => $p1->id,
            'titre'         => 'Intégration HTML/CSS',
            'description'   => 'Intégrer les maquettes en React avec Tailwind.',
            'statut'        => 'EN_COURS',
            'priorite'      => 'HAUTE',
            'assigne_a_id'  => $sophie->id,
            'date_echeance' => '2024-03-30',
        ]);

        Task::create([
            'project_id'   => $p1->id,
            'titre'        => 'Configuration CMS',
            'description'  => 'Mettre en place Strapi.',
            'statut'       => 'A_FAIRE',
            'priorite'     => 'MOYENNE',
            'assigne_a_id' => $sophie->id,
        ]);

        TaskHistory::create(['task_id' => $t1->id, 'user_id' => $jean->id,  'action' => 'CREATED',        'new_value' => $t1->titre, 'created_at' => now()]);
        TaskHistory::create(['task_id' => $t1->id, 'user_id' => $lucas->id, 'action' => 'STATUS_CHANGED', 'field' => 'statut', 'old_value' => 'A_FAIRE', 'new_value' => 'TERMINE', 'created_at' => now()]);

        $p2 = Project::create([
            'nom'         => 'App Mobile RH',
            'description' => 'Application mobile pour la gestion des congés.',
            'statut'      => 'ACTIF',
            'date_debut'  => '2024-02-01',
            'date_fin'    => '2024-09-30',
            'chef_id'     => $sophie->id,
        ]);

        DB::table('project_members')->insert([
            ['project_id' => $p2->id, 'user_id' => $sophie->id, 'created_at' => now()],
            ['project_id' => $p2->id, 'user_id' => $emma->id,   'created_at' => now()],
            ['project_id' => $p2->id, 'user_id' => $demo->id,   'created_at' => now()],
        ]);

        Task::create([
            'project_id'    => $p2->id,
            'titre'         => 'Spécifications techniques',
            'statut'        => 'TERMINE',
            'priorite'      => 'HAUTE',
            'assigne_a_id'  => $sophie->id,
            'date_echeance' => '2024-02-28',
        ]);

        Task::create([
            'project_id'    => $p2->id,
            'titre'         => 'API REST backend',
            'statut'        => 'EN_COURS',
            'priorite'      => 'HAUTE',
            'assigne_a_id'  => $emma->id,
            'date_echeance' => '2024-05-15',
        ]);

        $p3 = Project::create([
            'nom'         => 'Dashboard Analytics',
            'description' => 'Tableau de bord de suivi des KPIs métier.',
            'statut'      => 'EN_PAUSE',
            'date_debut'  => '2023-11-01',
            'date_fin'    => '2024-04-30',
            'chef_id'     => $jean->id,
        ]);

        DB::table('project_members')->insert([
            ['project_id' => $p3->id, 'user_id' => $jean->id,  'created_at' => now()],
            ['project_id' => $p3->id, 'user_id' => $lucas->id, 'created_at' => now()],
        ]);

        Task::create([
            'project_id'   => $p3->id,
            'titre'        => 'Connexion sources de données',
            'statut'       => 'EN_COURS',
            'priorite'     => 'HAUTE',
            'assigne_a_id' => $jean->id,
        ]);
    }
}
